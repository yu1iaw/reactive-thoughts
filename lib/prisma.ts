import { Thought } from "@prisma/client/react-native";
import { prisma } from "./db";

export const deleteAll = async () => {
    await prisma.thought.deleteMany();
}

export const createUser = async () => {
    try {
        await prisma.user.upsert({
            where: {
                id: 1
            },
            update: {},
            create: {}
        })
    } catch (error) {
        console.log(error);
    }
}

export const createThought = async (content: Thought["content"]) => {
    try {
        await prisma.thought.create({
            data: {
                content,
                sortingDate: new Date().toLocaleDateString('en', {
                    month: "long",
                    year: "numeric"
                }),
                creator: {
                    connect: {
                        id: 1
                    }
                }
            },
        })
    } catch (error) {
        console.log(error);
    }
}

export const editThought = async (thougthId: Thought["id"], content: Thought["content"]) => {
    try {
        await prisma.thought.update({
            where: {
                id: thougthId,
                creatorId: 1,
            },
            data: {
                content,
                sortingDate: new Date().toLocaleDateString('en', {
                    month: "long",
                    year: "numeric"
                }),
                updatedAt: new Date()
            }
        })
    } catch (error) {
        console.log(error);
    }
}

export const deleteThought = async (thoughtId: Thought["id"]) => {
    try {
        await prisma.thought.delete({
            where: {
                id: thoughtId,
                creatorId: 1
            }
        })
    } catch (error) {
        console.log(error);
    }
}

export const getSingleThought = async (thoughtId: Thought["id"]) => {
    try {
        const thought = await prisma.thought.findUnique({
            where: {
                id: thoughtId,
                creatorId: 1,
            },
        })
        return thought;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getAllThoughts = async (skipOdd: number) => {
    try {
        const thoughts = await prisma.thought.findMany({
            where: {
                creatorId: 1
            },
            take: 5,
            skip: skipOdd * 5,
            orderBy: {
                createdAt: "desc"
            }
        })
        return thoughts;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getThoughtsOverallCount = async () => {
    try {
        const count = await prisma.thought.count({
            where: {
                creatorId: 1
            }
        })
        
        return count;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getFilteredThoughts = async (skipOdd: number, text: string, dateFilter: Thought["sortingDate"] | null) => {
    try {
        const filteredThoughts = await prisma.thought.findMany({
            where: {
                creatorId: 1,
                content: {
                    contains: text ? text : undefined,
                },
                sortingDate: {
                    equals: dateFilter ? dateFilter : undefined
                },
            },
            take: 5,
            skip: skipOdd * 5,
            orderBy: {
                updatedAt: "desc"
            }
        })
        return filteredThoughts;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getFilteredThoughtsOverallCount = async (text: string, dateFilter: Thought["sortingDate"] | null) => {
    try {
        const count = await prisma.thought.count({
            where: {
                creatorId: 1,
                content: {
                    contains: text ? text : undefined,
                },
                sortingDate: {
                    equals: dateFilter ? dateFilter : undefined
                },
            }
        })
        return count;
    } catch (error) {
        console.log(error);
        throw error;
    }
}