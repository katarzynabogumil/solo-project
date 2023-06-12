import prisma from "./prisma";
import { Prisma } from '@prisma/client'

async function saveProjectToDb(userSub: string, data: Prisma.ProjectCreateInput) {
  const user = await prisma.user.findUnique({
    where: {
      sub: userSub
    },
  });
  if (!user) throw new Error();

  data.createdAt = new Date();

  const newProject = await prisma.project.create({
    data: {
      ...data,
      owners: {
        connect: { id: user.id }
      }
    },
  });
  return newProject;
}

async function getProjectsFromDB(userSub: string) {
  const projects = await prisma.project.findMany({
    where: {
      owners: {
        some: { sub: userSub }
      }
    },
    include: {
      owners: true,
      invitedUsers: true,
    },
  });
  return projects;
};

async function getProjectFromDB(id: number) {
  const project = await prisma.project.findUnique({
    where: {
      id
    },
    include: {
      owners: true,
      invitedUsers: true,
      expenses: {
        include: {
          category: {
            include: {
              expenses: true,
            }
          }
        }
      },
      categories: {
        include: {
          expenses: {
            include: {
              comments: true,
              category: true,
            }
          },
        }
      },
    },
  });
  return project;
};

async function updateProjectinDb(projectId: number, data: Prisma.ProjectUpdateInput) {
  // TODO - seperate functions for adding-removing users?
  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      ...data,
      updatedAt: new Date()
    }
  });
  return project;
};

async function deleteProjectsFromDB(projectId: number) {
  const project = await prisma.project.delete({
    where: {
      id: projectId
    },
  });
  return project;
};

export {
  saveProjectToDb,
  updateProjectinDb,
  getProjectsFromDB,
  getProjectFromDB,
  deleteProjectsFromDB,
};
