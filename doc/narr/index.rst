Introduction
============

Minimalistic demo of a server that resembles a REST facade in front of an LDAP service
with a simple UI to manage users and groups.


Authentication
--------------

For demo purposes, some URLs are accessible as an anonymous user (see :py:meth:`helloldap.server.Server.setup_routes` for details).

To manage users and groups with the client application, however, authentication with username and password is necessary.
To keep our API stateless, on successful login the server issues a JSON Web Token, which the client sends back
with every following request. The server will then allow access to the resource depending on the contents of the JWT,
no repetitive contact with LDAP is necessary.

By default, the JWT expires 10 minutes after it was issued. The client must be able to repeat the authentication and the
current request.


Server
------

The server is `aiohttp`_ which sits on top of Python's `asyncio`_ module. We replace the
built-in event-loop with `uvloop`_, which is said to be `faster than nodejs`_.

A full-flexed API could be documented and implemented with the help of `aiohttp_swagger`_.

Files in folder "public_html" are served as static files under URL "/static/...".



Client
------

A simple UI written with `Angular 2`_ and `Bootstrap 4`_.


.. _aiohttp: http://aiohttp.readthedocs.io/
.. _asyncio: https://docs.python.org/3/library/asyncio.html
.. _uvloop: https://github.com/MagicStack/uvloop
.. _faster than nodejs: https://magic.io/blog/uvloop-blazing-fast-python-networking/
.. _aiohttp_swagger: http://aiohttp-swagger.readthedocs.io/en/latest/
.. _Angular 2: https://angular.io/
.. _Bootstrap 4: https://ng-bootstrap.github.io/#/getting-started
