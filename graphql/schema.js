const { buildSchema } = require('graphql');

module.exports = buildSchema(`
        type User {
            _id: ID
            name: String
            email: String
            password: String
        }

        input UserInputData {
            email: String!
            name: String!
            password: String!
        }

        type AuthData {
            token: String!
            userId: String!
            index: Int!
        }

        type MusicPlayer {
            filePath: String!
            type: String!
            artist: String!
            title: String!
            similarSongs: [String]
        }

        type LikedSongQuery {
            likedSongArray: [String!]!
        }

        type RootQuery {
            login(email: String!, password: String!): AuthData!
            authentication: Int
            emailSend(email: String!): Boolean
            musicPlayer(songTitle: String!, currentType: String!): MusicPlayer!
            nextMusicPlayer(currentType: String!): MusicPlayer!
            prevMusicPlayer(currentType: String!): MusicPlayer!
            likedSongFetcher: LikedSongQuery!
        }

        type LikedSong {
            title: String
            artist: String
            path: String
        }

        type Message {
            message: String
        }

        type RootMutation {
            createUser(userInput: UserInputData): User!
            likedSong(pathToLikedSong: String!, artist: String!, title: String!): Message
            AddlikedSong(title: String!): Message
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }

`);
