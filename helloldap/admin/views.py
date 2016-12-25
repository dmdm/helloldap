"""
Views to handle administration of users and groups.
"""


from aiohttp import web


async def list_users(request):
    users = request.app['mock_ldap'].list_users()
    return web.json_response({
        'data': users
    })


async def get_user(request):
    username = request.match_info.get('username', None)
    if not username:
        raise web.HTTPBadRequest(reason='Missing username')
    user = request.app['mock_ldap'].get_user(username)
    if not user:
        raise web.HTTPNotFound()
    return web.json_response({
        'data': user
    })


async def list_groups(request):
    groups = request.app['mock_ldap'].list_groups()
    return web.json_response({
        'data': groups
    })


async def get_group(request):
    name = request.match_info.get('name', None)
    if not name:
        raise web.HTTPBadRequest(reason='Missing group name')
    group = request.app['mock_ldap'].get_group(name)
    if not group:
        raise web.HTTPNotFound()
    return web.json_response({
        'data': group
    })
