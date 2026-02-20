"""
WSGI config for config project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
from pathlib import Path

try:
	from whitenoise import WhiteNoise
except Exception:
	WhiteNoise = None

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_wsgi_application()
if WhiteNoise is not None:
	static_root = str(Path(__file__).resolve().parent.parent / "staticfiles")
	application = WhiteNoise(application, root=static_root)
