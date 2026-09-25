from django.db import migrations, models


def asignar_clasificaciones_existentes(apps, schema_editor):
    Producto = apps.get_model("catalogos", "Producto")
    Clasificacion = apps.get_model("catalogos", "Clasificacion")
    todas = list(Clasificacion.objects.all())
    for producto in Producto.objects.all():
        producto.clasificaciones.set(todas)


def revertir(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("catalogos", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="producto",
            name="clasificaciones",
            field=models.ManyToManyField(
                db_table="producto_clasificacion",
                related_name="productos",
                to="catalogos.clasificacion",
            ),
        ),
        migrations.RunPython(asignar_clasificaciones_existentes, revertir),
    ]
