class ScopedQuerysetMixin:
    """
    Limita el queryset al acopiador autenticado (vía `owner_lookup`),
    salvo que sea administrador, en cuyo caso ve todo.
    """

    owner_lookup = "acopiador"

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        if user.is_administrador:
            return queryset
        return queryset.filter(**{self.owner_lookup: user})
