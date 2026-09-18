from django.db import migrations


def marcar_superusuarios_como_administradores(apps, schema_editor):
    Acopiador = apps.get_model("accounts", "Acopiador")
    Acopiador.objects.filter(is_superuser=True).update(rol="administrador")


def revertir(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0002_acopiador_rol"),
    ]

    operations = [
        migrations.RunPython(marcar_superusuarios_como_administradores, revertir),
    ]
