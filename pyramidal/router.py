class CuffDataRouter(object):
    """
    A router to control all database operations on models in the
    'pyramidal' application.
    """

    def db_for_read(self, model, **hints):
        """
        Point all operations on cuffData models to 'cuffData'
        """
        if model._meta.app_label == 'pyramidal':
            return 'cuffData'
        return 'default'

    def db_for_write(self, model, **hints):
        """
        Point all operations on cuffData models to 'cuffData'
        """
        if model._meta.app_label == 'pyramidal':
            return 'cuffData'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow any relation if a both models in cuffData app
        """
        if obj1._meta.app_label == 'pyramidal' and obj2._meta.app_label == 'pyramidal':
            return True
        # Allow if neither is cuffData app
        elif 'pyramidal' not in [obj1._meta.app_label, obj2._meta.app_label]:
            return True
        return False

    def allow_migrate(self, db, model):
        if db == 'cuffData':
            return model._meta.app_label == 'pyramidal'
        elif model._meta.app_label == 'pyramidal':
            return False
        return None
