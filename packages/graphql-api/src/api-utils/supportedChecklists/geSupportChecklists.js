import config from '#/config';

const supportChecklistsForDownload = (
  config.supportChecklistsForDownload ?? ''
).split(',');

let checklistCache;

export default async function geSupportChecklists() {
  // store last successful result and return that. Then update the result in the background. First time there will be a delay
  if (checklistCache) {
    // update in the background
    fetchSupportChecklists()
      .then((data) => {
        checklistCache = data;
      })
      .catch((err) => {
        console.error('Error updating support checklists', err);
      });
    return checklistCache;
  }
  // first time - wait for result
  return fetchSupportChecklists()
    .then((data) => {
      checklistCache = data;
      return checklistCache;
    })
    .catch(() => {
      // if first time fails, return empty list and try again next time
      return {
        'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c': {
          title: 'GBIF Backbone Taxonomy',
          alias: 'GBIF',
        },
      };
    });
}

// function to look up individual checklistKeys names against checklist bank API https://api.checklistbank.org/dataset/gbif-d7dddbf4-2cf0-4f39-9b2a-bb099caae36c.json to get the title and alias
function getChecklistInfo(checklistKey) {
  const checklistBankApiUrl = `https://api.checklistbank.org/dataset/gbif-${checklistKey}.json`;

  return fetch(checklistBankApiUrl)
    .then((response) => response.json())
    .then((data) => {
      const { title, alias } = data;
      return { title, alias };
    }); // throw errors
}

// get information from a list of checklistKeys
export async function getChecklistsInfo(checklistKeys) {
  const checklistInfoPromises = checklistKeys.map((key) =>
    getChecklistInfo(key.trim()),
  );
  return Promise.all(checklistInfoPromises);
}

// main function to be called from the controller
export async function fetchSupportChecklists() {
  const checklistInfo = await getChecklistsInfo(supportChecklistsForDownload);
  return checklistInfo;
}
