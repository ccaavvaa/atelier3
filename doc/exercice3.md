# Exercice 3. Path Traversal
L'interface de l'application se trouve [ici](http://localhost:5000/mesDocuments)

C'est une page générée sur le serveur par le routeur mesDocumentsRouter

La page générée contient un iframe qui utilise un middleware express "serve-index" qui affiche le contenu d'un répertoire.
L'authentification est simulée par une initialisation "en dur" du customerCode.

1. Montrez des attaques possibles avec le code initial.
1. Remplacez serve-index par un middleware simple (voir src/tools/simple-index.ts et mesDocumentsRooter2) qui utilise des apis de lecture des fichiers/répertoires pour lister "mes documents" et qui ajoute des failles supplémentaires. Listez ces failles.
1. Indiquez des solutions pour corriger les failles.
