FROM python:3.7
ENV LANG C.UTF-8

RUN mkdir /django

RUN apt-get -y update
RUN apt-get install -y python python3-pip python-dev

ADD requirements.txt /django/requirements.txt
RUN pip install -r /django/requirements.txt

RUN apt-get -y update && apt-get -y autoremove
WORKDIR /django

EXPOSE 8000

CMD gunicorn -b 8000:8100 django.wsgi
