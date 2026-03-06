FROM python:3.7
ENV LANG C.UTF-8

RUN mkdir /django

# Dependencies for psycopg2; python/pip already in base image
RUN apt-get -y update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

ADD requirements.txt /django/requirements.txt
RUN pip install -r /django/requirements.txt

WORKDIR /django

EXPOSE 8000

CMD gunicorn -b 8000:8100 django.wsgi
