#!/bin/sh

if test -z "${INPUT_CACERT}"
then
    alias curl='curl --silent'
else
    echo "${INPUT_CACERT}" > cacert.pem
    alias curl='curl --silent --cacert cacert.pem'
fi

PIPELINE_ID=$(curl --request POST --form "token=${INPUT_TOKEN}" --form ref=${INPUT_REF} ${INPUT_URL}/api/v4/projects/${INPUT_PROJECT_ID}/trigger/pipeline | jq -r '.id')
URL=$(curl ${INPUT_URL}/api/v4/projects/${INPUT_PROJECT_ID}/pipelines/${PIPELINE_ID} | jq -r '.web_url')

echo "GitLab Pipeline URL: $URL"

STATUS=pending
until [ "$STATUS" != "pending" ] && [ "$STATUS" != "running" ]
do
    sleep 10
    STATUS=$(curl ${INPUT_URL}/api/v4/projects/${INPUT_PROJECT_ID}/pipelines/${PIPELINE_ID} | jq -r '.status')
done

if [ "$STATUS" = "success" ]
then
    exit 0
fi

exit 1
