import clickUpClient from './client.js';
import { saveStructure } from '../cache/structureCache.js';

const getTeams = async () => {
    const response = await clickUpClient.get('/team')
    const teams = response.data.teams.map((team: any) => {
        return {
            id: team.id,
            name: team.name
        }
    })
    return teams
}

export { getTeams };

const getSpaces = async (teamId: string) => {
    const response = await clickUpClient.get(`/team/${teamId}/space`)
    const spaces = response.data.spaces.map((space: any) => {
        return {
            id: space.id,
            name: space.name
        }
    })
    return spaces
}

export { getSpaces };

const getFolders = async (spaceId: string) => {
    const response = await clickUpClient.get(`/space/${spaceId}/folder`)
    const folders = response.data.folders.map((folder: any) => {
        return {
            id: folder.id,
            name: folder.name
        }
    })
    return folders
}

export { getFolders };

const getLists = async (folderId: string) => {
    const response = await clickUpClient.get(`/folder/${folderId}/list`)
    const lists = response.data.lists.map((list: any) => {
        return {
            id: list.id,
            name: list.name
        }
    })
    return lists
}

export { getLists };

const getTasks = async (listId: string) => {
    const response = await clickUpClient.get(`/list/${listId}/task`)
    const tasks = response.data.tasks.map((task: any) => {
        return {
            id: task.id,
            name: task.name
        }
    })
    return tasks
}

export { getTasks };

export default async function loadStructure() {
    const teams = await getTeams();

    const structure = await Promise.all(teams.map(async (team: any) => {
        const spaces = await getSpaces(team.id);

        team.spaces = await Promise.all(spaces.map(async (space: any) => {
            const folders = await getFolders(space.id);

            space.folders = await Promise.all(folders.map(async (folder: any) => {
                const lists = await getLists(folder.id);

                folder.lists = await Promise.all(lists.map(async (list: any) => {
                    const tasks = await getTasks(list.id);
                    
                    // Adicionando tasks como propriedade da lista
                    list.tasks = tasks;
                    
                    // Nota: O ClickUp trata boards como views e não temos uma função `getBoards` implementada.
                    // Se você criar um `getBoards(list.id)` depois, pode adicionar aqui:
                    // list.boards = await getBoards(list.id);

                    return list;
                }));

                return folder;
            }));

            return space;
        }));

        return team;
    }));

    return structure;
}

const structure = await loadStructure();
await saveStructure(structure);


