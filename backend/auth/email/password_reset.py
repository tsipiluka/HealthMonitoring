def generate_mail(resetlink):

    content = f"Sehr geehrte/r Nutzer:in,\nSie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt. Bitte klicken Sie auf den folgenden Link, um Ihr Passwort zurückzusetzen:\n{resetlink}\nWenn Sie die Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren und Ihr Passwort bleibt unverändert.\n\nVielen Dank, Ihr Health-Monitoring Team"
    
    return content