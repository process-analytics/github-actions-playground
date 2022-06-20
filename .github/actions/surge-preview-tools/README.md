# surge-preview-tools action

Companion of the [surge-preview action](https://github.com/afc163/surge-preview).

Help to detect if the surge-preview action should be run
- validate the provided surge token i.e. is related to a valid login 
- detect if the deployment already exist. Avoid teardown error when the deployment doesn't exist or has not been created by the provided surge account

Limitations
- Use in Pull Request only

## Usage 

See [action.yml](./action.yml) for inputs and outputs.

Example
```yaml
steps:
  - uses: process-analytics/github-actions-playground/.github/actions/surge-preview-tools/@TAGNAME
    id: surge-preview-tools
    with:
      surge-token: ${{ secrets.SURGE_TOKEN }}
  - name: Echo surge preview tools output
    run: |
      echo "can-run-surge-command: ${{ steps.surge-preview-tools.outputs.can-run-surge-command }}"
      echo "domain-exist: ${{ steps.surge-preview-tools.outputs.domain-exist }}" 
      echo "preview-url: ${{ steps.surge-preview-tools.outputs.preview-url }}" 
      echo "surge-token-valid: ${{ steps.surge-preview-tools.outputs.surge-token-valid }}"
  - name: Build fake demo
    if: ${{ github.event.action != 'closed' }}
    env:
      PR_NUMBER: ${{ github.event.pull_request.number }}
    run: |
      mkdir site
      echo "This is a preview site for <b>PR #${PR_NUMBER}</b>" > site/index.html
  - name: Publish Demo preview
    if: steps.surge-preview-tools.outputs.can-run-surge-command == 'true'
    id: publish_demo_preview
    uses: afc163/surge-preview@v1
    with:
      surge_token: ${{ secrets.SURGE_TOKEN }}
      github_token: ${{ secrets.GITHUB_TOKEN }}
      dist: site
      failOnError: true
      teardown: true
      build: |
        ls -lh site
```


## Build

`npm run build` then commit the dist folder

## Resources

- https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
- https://github.com/adrianjost/actions-surge.sh-teardown: for surge cli output parsing
