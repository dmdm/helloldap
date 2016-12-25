#!/usr/bin/env python
"""
CLI to start the server.
"""


import argparse
import os
import sys
import time
import logging
import datetime

from ..cli import add_parser_args, init_cli_locale, build_rc
from ..logging_tools import LOGGING_RC, setup_logging
from ..server import Server


DEFAULT_RC = {
    'host': '::1',
    'port': 11223,
    'verbose': 0,
    'auth.jwt.secret': 'qweerfhuwez8$"§$hn32',
    'auth.jwt.algorithm': 'HS256',
    'auth.jwt.valid_for': 8 * 60 * 60,  # seconds
    'logging': LOGGING_RC
}


class Runner:
    """
    This is the CLI wrapper to start the server.

    :param server: Instance of the server to start.
    """

    def __init__(self, server):
        self.server = server
        self.rc = None
        self.lgg = None
        self.lang_code = None
        self.encoding = None
        self.parser = None
        self.app = None

    def init_runner(self, args, lgg=None):
        """
        Initialises runner with logger, console, rc.

        Logger and rc are passed to the server.

        :param args: Namespace of parsed CLI arguments
        :param lgg: Inject a logger, or keep the default module logger
        """
        self.rc = build_rc(args, DEFAULT_RC)
        self.lgg = lgg
        self.server.rc = self.rc
        self.server.lgg = lgg
        setup_logging(lgg, self.rc)

        self.lang_code, self.encoding = init_cli_locale(
            self.rc.get('locale', None),
            detach_stdout=False
        )
        self.lgg.debug("TTY? {}".format(sys.stdout.isatty()))
        self.lgg.debug("Locale? {}, {}".format(self.lang_code, self.encoding))

    def run(self):
        """
        Run, Lola, run.
        """
        self.server.run()


def parse_args(runner, argv):
    # Main parser
    p = argparse.ArgumentParser(conflict_handler='resolve')
    runner.parser = p
    add_parser_args(p, (
        ('config', False),
        ('locale', False),
        ('verbose', False)
    ))
    p.add_argument(
        '-h',  # overrides default '-h' for help
        '--host',
        default=DEFAULT_RC['host'],
        help="IP address on which server listens. Defaults to {}".format(
            DEFAULT_RC['host'])
    )

    return p.parse_args(argv[1:])


def main(argv=None):
    start_time = time.time()
    if not argv:
        argv = sys.argv

    app_name = os.path.basename(argv[0])
    lgg = logging.getLogger('cli.' + app_name)

    try:
        runner = Runner(server=Server())
        args = parse_args(runner, argv)

        runner.init_runner(args, lgg=lgg)
        if hasattr(args, 'func'):
            args.func()
        else:
            runner.run()
    except Exception as exc:
        lgg.exception(exc)
        lgg.fatal('Program aborted!')
    else:
        lgg.info('Finished.')
    finally:
        lgg.info('Time taken: {}'.format(
            datetime.timedelta(seconds=time.time() - start_time))
        )
        logging.shutdown()


if __name__ == '__main__':
    main(sys.argv)
