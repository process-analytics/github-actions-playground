# surge-preview-tools action

Companion of the [surge-preview action](https://github.com/afc163/surge-preview).

Help to detect if the surge-preview action should be run
- validate the provided surge token i.e. is related to a valid login 
- detect if the deployment already exist. Avoid teardown error when the deployment doesn't exist or has not been created by the provided surge account

Limitations
- Use in Pull Request only

## Documentation 

**TODO**

see [action.yml](./action.yml)

## Build

`npm run build` then commit the dist folder

## Resources

- https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
- https://github.com/adrianjost/actions-surge.sh-teardown: for surge cli output parsing
