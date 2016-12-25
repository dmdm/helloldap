"""
Tools to setup and help with logging.
"""


import time

import logging
import logging.config


LOGGING_RC = {
    'version': 1,
    'incremental': False,
    'disable_existing_loggers': False,
    'formatters': {
        'default': {
            'format': '{asctime} {name} {module} {process:d} {thread:d} {levelname:8s} {message}',
            'style': '{',
            # Timestamps in UTC!
            '()': 'helloldap.logging_tools.UTCFormatter'
        },
        'access': {
            'format': '%a %l %u %t "%r" %s %b "%{Referrer}i" "%{User-Agent}i"',
            # Timestamps in UTC!
            '()': 'helloldap.logging_tools.UTCFormatter'
        }
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'default',
            'stream': 'ext://sys.stdout'
        },
        'aiohttp': {
            'class': 'logging.StreamHandler',
            'stream': 'ext://sys.stdout'
        }
    },
    'loggers': {
        # The ROOT logger
        '': {
            'handlers': ['console'],
            'level': 'WARN'
        },
        # Root logger of our CLI app
        'cli': {
            'level': 'WARN'
        },
        # Root logger of module asyncio
        'asyncio': {
            'level': 'DEBUG'
        },
        # Root logger for aiohttp
        'aiohttp': {
            'level': 'DEBUG',
            'handlers': ['aiohttp'],
            'propagate': False
        },
        # aiohttp has these child loggers:
        # aiohttp.access, aiohttp.client, aiohttp.internal, aiohttp.server,
        # aiohttp.web, aiohttp.websocket
        'aiohttp.access': {
            'formatter': 'access'
        }
    },
}


class UTCFormatter(logging.Formatter):
    """
    Helper class to set all logged timestamps to UTC.
    """
    converter = time.gmtime


def setup_logging(lgg, rc):
    """
    Configures logging according to settings given in rc.

    Adjusts log level of given logger according to verbosity required by rc.

    :param lgg: Instance of a logger (e.g. root logger of this app)
    :param rc: Dict with settings
    """
    logging.config.dictConfig(rc['logging'])
    v = rc.get('verbose', 0)
    if v:
        if v > 1:
            lgg.setLevel(logging.DEBUG)
            if v > 3:
                logging.getLogger().setLevel(logging.DEBUG)
            elif v > 2:
                logging.getLogger().setLevel(logging.INFO)
        elif v > 0:
            lgg.setLevel(logging.INFO)


def format_request(request):
    """
    Formats some request properties like in the access log.

    Template is::

        "{method} {url} HTTP/{version.major}.{version.minor}"

    :param request: Instance of a request.
    :return: Formatted string
    """
    return '"{method} {url} HTTP/{version.major}.{version.minor}"'.format(
        method=request.method, url=request.rel_url, version=request.version)
