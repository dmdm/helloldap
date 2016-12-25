"""
The server.
"""

import os
import asyncio
import uvloop
from aiohttp import web
import aiohttp_cors

from .auth.mw import check_jwt, check_authorization
from .mock_ldap import MockLdap
from .demo import views as demo_views
from .auth import views as auth_views
from .admin import views as admin_views


class Server:
    """
    This is the actual server.

    After instantiation, but before calling :meth:`run`, set these
    properties:

      - 'lgg': Instance of a logger
      - 'rc': Instance of the dict with configuration

    After :meth:`run` was called, property 'app' will contain the instance
    of the web application.
    """

    def __init__(self):
        self.lgg = None
        self.rc = None
        self.app = None

    def _on_startup(self, app):
        self.lgg.info('Starting up...')
        pass

    def _on_cleanup(self, app):
        self.lgg.info('Cleaning up...')
        pass  # disconnect from DB etc

    def _on_shutdown(self, app):
        self.lgg.info('Shutting down...')
        pass  # shutdown long running handlers, e.g. websockets

    # Public method so that we can reference it from doc.
    def setup_routes(self):
        cors_rc = {
            '*': aiohttp_cors.ResourceOptions()
        }
        cors = aiohttp_cors.setup(self.app, defaults={
            "*": aiohttp_cors.ResourceOptions(
                allow_credentials=True,
                expose_headers="*",
                allow_headers="*",
            )
        })

        self.app.router.add_get('/', demo_views.handle),
        self.app.router.add_get('/{name}', demo_views.handle),

        self.app.router.add_post('/api/v1/login', auth_views.login),

        self.app.router.add_get('/api/v1/admin/user', admin_views.list_users),
        self.app.router.add_get('/api/v1/admin/user/{username}', admin_views.get_user),

        self.app.router.add_get('/api/v1/admin/group', admin_views.list_groups),

        for route in list(self.app.router.routes()):
            cors.add(route)

        self.app.router.add_static('/static/',
            path=os.path.join(self.rc['root_dir'], 'public_html'),
            name='static'),

    def _setup_app(self):
        asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())
        loop = asyncio.get_event_loop()

        self.app = web.Application(
            loop=loop,
            middlewares=[
                check_jwt,
                check_authorization,
            ]
        )
        self.app.on_startup.append(self._on_startup)
        self.app.on_cleanup.append(self._on_cleanup)
        self.app.on_shutdown.append(self._on_shutdown)
        self.app['rc'] = self.rc
        self.app['lgg'] = self.lgg
        self.app['mock_ldap'] = MockLdap(self.lgg)

        self.setup_routes()

    def run(self):
        """
        Run until interrupted with CTRL-C.
        """
        self._setup_app()
        self.lgg.info("Starting server at {host} port {port}".format(
            host=self.rc['host'], port=self.rc['port']))
        web.run_app(
            self.app,
            host=self.rc['host'],
            port=self.rc['port'],
            print=self.lgg.info
        )
