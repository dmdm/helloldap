"""
Tools for handling JSON Web Tokens.
"""


import datetime
import jwt
import re
from ..exc import MissingJwtError


RE_BEARER = re.compile(r'^Bearer +', re.I)


def encode(payload, secret, algorithm='HS256',
        valid_for=datetime.timedelta(seconds=600)):
    """
    Encodes the given payload into a JWT.

    Sets these reserved claims:

      - 'iat': Timestamp when the token is issued, which is now in UTC.
      - 'nbf': Same as 'iat'. The token cannot be valid before it was issued.
      - 'exp': The token will expire `valid_for` seconds after issue time.

    :param payload: Dict with public claims.
    :param secret: A key to encrypt/decrypt the JWT
    :param algorithm: Algorithm to encrypt
    :param valid_for: Seconds the token is valid after issue time
    :return: JWT as string
    """
    ts = datetime.datetime.utcnow()
    payload['iat'] = ts
    payload['nbf'] = ts
    payload['exp'] = ts + valid_for
    token = jwt.encode(payload, secret,
        algorithm=algorithm)
    return token.decode('utf-8')


def decode_headers(headers, secret):
    """
    Decodes JWT and returns payload.

    Looks for a JWT in header "Authorization". Raises exceptions if that
    header is not present or otherwise invalid (e.g. wrong format, expired).

    :param headers: Headers of current request
    :param secret: Key to decrypt the JWT
    :return: Dict with payload
    :raise MissingJwtError: if "Authorization" header is not found
    :raise jwt.exceptions.InvalidTokenError: if the token is otherwise not
        valid. Exception can also be one of those in :mod:`jwt.exceptions`.
    """
    token = headers.get('Authorization', None)
    if not token:
        raise MissingJwtError()
    if not RE_BEARER.match(token):
        raise jwt.exceptions.InvalidTokenError()
    token = RE_BEARER.sub('', token)
    return jwt.decode(token, secret)
