"""
Exceptions.
"""


class HelloLDAPError(Exception):
    """
    Base exception of this app.
    """
    pass


class AuthenticationFailedError(HelloLDAPError):
    """
    Raised when username/password could not be authenticated.
    """
    pass


class MissingJwtError(HelloLDAPError):
    """
    Raised when JWT was not present in request headers.
    """
    pass
