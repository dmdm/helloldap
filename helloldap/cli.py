"""
Tools to assist CLI scripts.
"""


import locale
import os
import sys
from collections import ChainMap
import yaml


def init_cli_locale(locale_name, detach_stdout=True):
    """
    Initialises CLI locale and encoding.

    Sets a certain locale. Ensures that output is correctly encoded, whether
    it is send directly to a console or piped.

    :param locale_name: A locale name, e.g. "de_DE.utf8".
    :param detach_stdout: If True (default), and we are not in a TTY (meaning,
        output is piped somewhere), we replace original STDOUT with a writer
        from the codecs module. If you do not want that (e.g. in PyCharm test
        runner), set this to False.
    :return: active locale as 2-tuple (lang_code, encoding)
    """
    # Set the locale
    if locale_name:
        locale.setlocale(locale.LC_ALL, locale_name)
    else:
        if sys.stdout.isatty():
            locale.setlocale(locale.LC_ALL, '')
        else:
            locale.setlocale(locale.LC_ALL, 'en_GB.utf8')
    lang_code, encoding = locale.getlocale(locale.LC_CTYPE)
    # If output goes to pipe, detach stdout to allow writing binary data.
    # See http://docs.python.org/3/library/sys.html#sys.stdout
    if detach_stdout and not sys.stdout.isatty():
        if hasattr(sys.stdout, 'detach'):
            import codecs
            sys.stdout = codecs.getwriter(encoding)(sys.stdout.detach())
    return lang_code, encoding


def add_parser_args(parser, which=None):
    """
    Adds default arguments to given parser instance.

    :param parser: Instance of a parser
    :param which: List of 2-Tuples. 1st elem tells which argument to add,
        2nd elem tells requiredness.
    """
    parser.add_argument(
        '--root-dir',
        default=os.getcwd(),
        help="Use this directory as root/work"
    )
    parser.add_argument(
        '--etc-dir',
        help="Directory with config, defaults to ROOT_DIR/etc"
    )
    if not which:
        which = [('config', False), ('locale', False), ('verbose', False)]
    for x in which:
        if x[0] == 'config':
            parser.add_argument(
                '-c',
                '--config',
                required=x[1],
                help="""Path to YAML file with configuration"""
            )
        elif x[0] == 'locale':
            parser.add_argument(
                '-l',
                '--locale',
                required=x[1],
                help="""Set the desired locale.
                    If omitted and output goes directly to console, we
                    automatically use the console's locale."""
            )
        elif x[0] == 'verbose':
            parser.add_argument(
                '-v', '--verbose',
                action='count',
                default=0,
                help="""Sets logging level to show more details, can be
                    stacked; e.g. -vvv. Typically we log only level warnings
                    and higher, -v also logs level info, and -vv logs level
                    debug. -vvv and -vvvv additionally sets root logger to
                    level warnings or debug. If omitted at all, we use the
                    settings from the config file."""
            )
        else:
            raise ValueError("Unknown: '{}'".format(x[0]))


def build_rc(args, default_rc, config='config'):
    """
    Builds map of settings.

    Settings are taken from `default_rc`, optionally overridden by settings
    in the config file specified on command line, optionally overridden by
    explicit command line arguments.

    :param args: Namespace with CLI arguments
    :param default_rc: Dict with default settings
    :param config: Key in `args` that gives path to external config file
    :return: ChainMap with settings
    """
    cli_rc = {k: v for k, v in vars(args).items() if v}
    fn = cli_rc.get(config, None)
    if fn:
        if not os.path.exists(fn):
            raise FileNotFoundError(fn)
        with open(fn, 'rt', encoding='utf-8') as fh:
            file_rc = yaml.safe_load(fh)
        return ChainMap(cli_rc, file_rc, default_rc)
    else:
        return ChainMap(cli_rc, default_rc)
