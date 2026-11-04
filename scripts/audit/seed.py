# Creates the audit user and fictional test data for the full accessibility audit
# and prints the JWTs of the audit user as the last line ("AUDIT_TOKENS={...}").
# Run inside the backend with: python manage.py shell -c "$(cat seed.py)"
import json

from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

from api.models import Job, Member, Task

user, _ = User.objects.get_or_create(username="cypressaudit")
# the audit never logs in via the form, the tokens are created directly
user.set_unusable_password()
user.save()

jobs = {}
for name, workers, requires_legal_age in [
    ("Bar", 4, "doesRequireLegalAge"),
    ("Grill", 3, "doesNotRequireLegalAge"),
    ("Kasse", 2, "doesRequireLegalAge"),
    ("Aufbau", 6, "doesNotRequireLegalAge"),
    ("Kinderprogramm", 2, "doesNotRequireLegalAge"),
]:
    jobs[name], _ = Job.objects.get_or_create(
        job=name,
        defaults={"workers": workers, "requires_legal_age": requires_legal_age},
    )

for name, surname, age, job in [
    ("Anna", "Beispiel", "ofLegalAge", "Bar"),
    ("Bernd", "Muster", "ofLegalAge", "Bar"),
    ("Clara", "Probe", "ofLegalAge", "Kasse"),
    ("David", "Test", "underage", "Grill"),
    ("Eva", "Demo", "ofLegalAge", "Aufbau"),
    ("Felix", "Platzhalter", "underage", "Kinderprogramm"),
    ("Greta", "Fiktiv", "ofLegalAge", None),
    ("Hannes", "Erfunden", "underage", None),
]:
    Member.objects.get_or_create(
        name=name,
        surname=surname,
        defaults={"age": age, "job": jobs[job] if job else None},
    )

for task, description, priority, finished in [
    ("Getränke bestellen", "Bier, Limo und Wasser für **zwei Tage**.", "high", False),
    ("Zelt reservieren", "Beim Verleih anrufen und Termin bestätigen.", "middle", False),
    ("Plakate aufhängen", "", "low", False),
    ("Kasse vorbereiten", "Wechselgeld bei der Bank holen.", "high", True),
    ("Helferliste drucken", None, "low", True),
]:
    Task.objects.get_or_create(
        task=task,
        defaults={
            "description": description,
            "priority": priority,
            "finished": finished,
        },
    )

refresh = RefreshToken.for_user(user)
print(
    "AUDIT_TOKENS="
    + json.dumps({"access": str(refresh.access_token), "refresh": str(refresh)})
)
