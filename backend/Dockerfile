# Pull base image
FROM python:3.10.2-slim-bullseye

# Set environment variables
ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /backend

COPY requirements.txt /backend/

RUN pip install -r requirements.txt && \
    pip install --upgrade pip

COPY ./entrypoint.sh /

ENTRYPOINT [ "sh", "/entrypoint.sh" ]