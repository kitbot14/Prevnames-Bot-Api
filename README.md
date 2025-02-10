# Prevnames-Bot-Api

### [report bug ](https://tracker.ninjamod.fr)
### [support ](https://discord.gg/ninjamod)
### [api ](https://api.ninjamod.fr)
### [shop ](https://ninjamod.fr)
### [redirection ](https://link.ninjamod.fr)

### un bot de prevname dev par 2.0kit qui save les prevname sur un repost git pour add le bot https://discord.com/oauth2/authorize?client_id=1331036327138820116&permissions=8&integration_type=0&scope=bot

## Ce tutoriel explique comment interagir avec l'API qui permet de gérer les anciens pseudos d'un utilisateur. L'API offre deux principales fonctionnalités : vérifier les anciens pseudos et ajouter un nouveau pseudo.
### Routes disponibles
### Vérifier les anciens pseudos d'un utilisateur
### url 
``` https://api.ninjamod.fr/api/prevnames-check/userId ```

## Paramètres
### userId` : L'ID Discord de l'utilisateur pour lequel vous souhaitez récupérer les anciens pseudos.
``` https://api.ninjamod.fr/api/prevnames-check/1248774218720743475 ```

## Ajouter un ancien pseudo
### URL
 ``` https://api.ninjamod.fr/api/prevnames-add ```

## Paramètres
### Le corps de la requête doit contenir un objet JSON avec les éléments suivants :
- userId : L'ID Discord de l'utilisateur.
- newName : Le nouveau pseudo à ajouter.
- type : Le type du pseudo (peut être server ou account).
## Exemple de requête
```
{
    "userId": "123456789",
    "newName": "nouveau_pseudo",
    "type": "server"
}
```

last update 

```javascript
update du ready.js
ajoue dun module
fix de la api
