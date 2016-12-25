"""
Middleware factories for authorization.

Usage::

        :
        v
    check_jwt               sets request['jwt_payload']
        |
        v
    check_authorization     uses request['jwt_payload']['g']
        :
        v
"""

from aiohttp import web
import re
import jwt.exceptions

from ..logging_tools import format_request
from ..exc import MissingJwtError
from .jwt_tools import decode_headers


RE_ADMIN = re.compile(r'/api/v\d+/admin/')
RE_LOGIN = re.compile(r'/api/v\d+/login')


async def check_jwt(app, handler):
    """
    Checks presence and validity of a JWT for specific URLs.

    Requires a JWT for all URLs starting with '/api' (all others may be
    accessed anonymously).

    Stores the payload in 'request['jwt_payload'].

    :param app: Current web app
    :param handler: Previous middleware handler
    :return: This handler
    :raise web.HTTPForbidden: if JWT is invalid
    """
    async def middleware_handler(request):
        p = request.rel_url.path
        if not request.method == 'OPTIONS' and p.startswith('/api') and not RE_LOGIN.match(p):
            try:
                request['jwt_payload'] = decode_headers(request.headers,
                    app['rc']['auth.jwt.secret'])
            except jwt.exceptions.ExpiredSignatureError:
                app['lgg'].debug('JW token expired: {}"'.format(
                    format_request(request)))
                raise web.HTTPUnauthorized()
            except (MissingJwtError, jwt.exceptions.InvalidTokenError):
                app['lgg'].debug('Missing or invalid JWT: {}"'.format(
                    format_request(request)))
                raise web.HTTPForbidden()
        response = await handler(request)
        return response
    return middleware_handler


async def check_authorization(app, handler):
    """
    Checks authorization to access certain URLs.

    This is a simple, hard-coded authorization check, that treats groups as
    roles. If we determine that a role may access a resource, current user has
    full access to it.

    Since we do not discern access methods, it is not even a real implementation
    of RBAC.

    :param app: Current web app
    :param handler: Previous middleware handler
    :return: This handler
    :raise web.HTTPForbidden: if no role has access to given resource
    """
    async def middleware_handler(request):
        p = request.rel_url.path
        if not request.method == 'OPTIONS' and RE_ADMIN.match(p):
            if 'wheel' not in request['jwt_payload']['g']:
                app['lgg'].debug(
                    "User '{user}' not in group 'wheel': {req}".format(
                        user=request['jwt_payload']['u'],
                        req=format_request(request)))
                raise web.HTTPForbidden()
        response = await handler(request)
        return response
    return middleware_handler
