"""
Mock LDAP server.
"""


import copy

from helloldap.exc import AuthenticationFailedError


USERS = [
    {'username': 'ernie', 'password': 'ernie', 'groups': ['users', 'sesame_street']},
    {'username': 'bert', 'password': 'bert', 'groups': ['users', 'sesame_street']},
    {'username': 'admin', 'password': 'admin', 'groups': ['users', 'wheel']},
    {'username': 'foo', 'password': 'foo', 'groups': ['users']},
    {'username': 'bar', 'password': 'bar', 'groups': ['users']}
]

GROUPS = ['users', 'wheel', 'sesame-street']


class MockLdap:
    def __init__(self, lgg):
        self.lgg = lgg
        self.data = {
            'users': copy.deepcopy(USERS)
        }

    def authenticate(self, username, password):
        for u in self.data['users']:
            if u['username'] == username and u['password'] == password:
                data = {'groups': u['groups']}
                self.lgg.debug("User '{}' authenticated: {}".format(username, data))
                return data
        self.lgg.debug("Authentication failed for user '{}' with "
            "password '{}'".format(username, password))
        raise AuthenticationFailedError()

    def list_users(self):
        return [u['username'] for u in USERS]

    def get_user(self, username):
        for u in USERS:
            if u['username'] == username:
                return u
        return None

    def list_groups(self):
        return GROUPS[:]
