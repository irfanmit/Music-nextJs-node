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
            email: String!
        }

        type MusicPlayer {
            filePath: String!
            type: String!
            artist: String!
            title: String!
            similarSongs: [String]
            image : String
        }

        type LikedSongQuery {
            likedSongArray: [String!]!
        }

        type Exist {
            exist : Boolean!
        }

        type RootQuery {
            login(email: String!, password: String!): AuthData!
            authentication: Int
            emailSend(email: String!): Boolean
            musicPlayer(songTitle: String!, currentType: String!): MusicPlayer!
            nextMusicPlayer(currentType: String!): MusicPlayer!
            prevMusicPlayer(currentType: String!): MusicPlayer!
            likedSongFetcher: LikedSongQuery!
            isLikedSong(path : String!) : Exist!
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
            resetPassword(newPassword: String!, email: String!): Message
            likedSong(pathToLikedSong: String!, artist: String!, title: String!): Message
            AddlikedSong(title: String!): Message
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }

`);
