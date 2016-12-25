"""
Views to handle authentication and authorization.
"""


import datetime
from aiohttp import web

from helloldap.exc import AuthenticationFailedError
from . import jwt_tools


async def login(request):
    """
    Authenticates given user against LDAP.

    If given credentials are correct, returns a JWT that contains this
    payload (dict):

        - 'u': Username that was given as part of the credentials
        - 'g': List of groups the user is member of.

    More details about the payload are described here:
    :meth:`helloldap.auth.jwt_tools.encode`.

    :param request: Current request
    :return: JWT as string.
    """
    cred = await request.json()
    print(cred)
    username = cred.get('username', None)
    password = cred.get('password', None)
    try:
        data = request.app['mock_ldap'].authenticate(username, password)
        payload = {
            'u': username,
            'g': data['groups']
        }
        token = jwt_tools.encode(
            payload,
            request.app['rc']['auth.jwt.secret'],
            algorithm=request.app['rc']['auth.jwt.algorithm'],
            valid_for=datetime.timedelta(
                seconds=request.app['rc']['auth.jwt.valid_for'])
        )
        payload['jwt'] = token
        return web.json_response({
            'data': {
                'username': username,
                'jwt': token,
                'groups': data['groups']
            }
        })
    except AuthenticationFailedError:
        return web.HTTPForbidden()
