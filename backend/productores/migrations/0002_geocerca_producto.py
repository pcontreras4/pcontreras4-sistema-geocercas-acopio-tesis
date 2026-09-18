import django.db.models.deletion
from django.db import migrations, models


def borrar_geocercas_sin_producto(apps, schema_editor):
    Geocerca = apps.get_model("productores", "Geocerca")
    Geocerca.objects.all().delete()


def revertir(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("catalogos", "0001_initial"),
        ("productores", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(borrar_geocercas_sin_producto, revertir),
        migrations.AddField(
            model_name="geocerca",
            name="producto",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="geocercas",
                to="catalogos.producto",
            ),
            preserve_default=False,
        ),
    ]
