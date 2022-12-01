import os
import json


class ReadSecrets:
    def read_secrets(attribute):
        filename = os.path.join("secrets.json")
        try:
            with open(filename, mode="r") as f:
                return json.load(f)[attribute]
        except FileNotFoundError:
            return {}
