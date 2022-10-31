# Exercice 1. Injection SQL
L'interface de l'application se trouve dans le fichier [public/ex1et2.html](http://localhost:5000/ex1et2.html)

La partie haute de l'application permet de trouver des personnes dans la base de données.

Arrivé à ce stade, vous avez tout ce qu’il faut pour essayer d'accéder à des colonnes non prévues pour la lecture, etc.

Pour informations sur une base SQLite vous pouvez utiliser [la table sqlite_master](https://www.sqlite.org/schematab.html) et [la fonction pragma_table_info](https://www.sqlite.org/pragma.html#pragma_table_info).

Un exemple d'ataque
```javascript
// liste des attaques
    const attacks = [
        ['a1', "ga%' union select entreprise nom, sujet prenom, montant age, '' url from CONTRATS--"]
    ];
```

1. Vous devez exploiter les failles et ajouter des attaques possibles dans la liste "attacks" qui se trouve dans le fichier ex1et2.html
1. Vous devez corriger les failles dans le fichier src\controllers\persons-controller.ts.

