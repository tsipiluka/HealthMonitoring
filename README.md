# HealthMonitoring
---
## Requirements

### Anaconda

Download latest version from https://www.anaconda.com/products/distribution#Downloads

1. After installation create an environment using the following command 
    ```bash
    $ conda create --name myenv
    ```
    In case of an existing evnironment you can it with the following command
    ```bashconda info --envs
    $ conda info --envs
    ```
2. proceed with 
    ```bash
    $ proceed ([y]/n)?
    ```
3. To Specify the python version use
   ```bash
   $ conda create -n myenv python=3.9
   ```
4. To activate the newly create environment use
    ```bash
    $ conda activate myenv
    ```
5. The acivated environment is indicated by
    ```(testenv)``` in beginning of the active terminal line

#### PIP Package Manager
1. Activate the created Conda environment
2. Install PIP by running
   ```bash
   $ conda install pip
   ```

### Django
1. Activate the created Conda environment
2. Install Django by running
   ```bash
   $ pip install Django
   ```
