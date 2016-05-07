from Fasteignir import db

class Fasteignir(db.Model):
    __table__ = db.Model.metadata.tables['Fasteignir']

    def __repr__(self):
        return self.fasteign_id

class Fasteignir_changes(db.Model):
    __table__ = db.Model.metadata.tables['Fasteignir_changes']

    def __repr__(self):
        return self.fasteign_id
