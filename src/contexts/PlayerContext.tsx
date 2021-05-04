import { createContext, useState, ReactNode, useContext } from 'react'

type Episode = {
    title: string
    members: string
    thumbnail: string
    duration: number
    url: string
}

interface IPlayerContextData {
    episodeList: Episode[]
    currentEpisodeIndex: number
    isPlaying: boolean
    isLooping: boolean
    isShuffling: boolean
    play: (episode: Episode) => void
    togglePlay: () => void
    toggleLoop: () => void
    toggleShuffle: () => void
    setPlayingState: (state: boolean) => void
    playList: (list: Episode[], index: number) => void
    playNext: () => void
    playPrevious: () => void
    hasNext: boolean
    hasPrevious: boolean
    clearPlayerState: () => void
}

export const PlayerContext = createContext({} as IPlayerContextData)

interface IPlayerContextProvider {
    children: ReactNode
}

export const PlayerContextProvider = ({ children }: IPlayerContextProvider) => {
    const [episodeList, setEpisodeList] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number>(0)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [isLooping, setIsLooping] = useState<boolean>(false)
    const [isShuffling, setIsShuffling] = useState<boolean>(false)
  
    const play = (episode: Episode) => {
      setEpisodeList([episode])
      setCurrentEpisodeIndex(0)
      setIsPlaying(true)
    }

    const playList = (list: Episode[], index: number) => {
        setEpisodeList(list)
        setCurrentEpisodeIndex(index)
        setIsPlaying(true)
    }
  
    const togglePlay = () => setIsPlaying(!isPlaying)

    const toggleLoop = () => setIsLooping(!isLooping)

    const toggleShuffle = () => setIsShuffling(!isShuffling)

    const setPlayingState = (state: boolean) => {
        setIsPlaying(state)
    }
    
    const hasPrevious = currentEpisodeIndex > 0
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

    const clearPlayerState = () => {
        setEpisodeList([])
        setCurrentEpisodeIndex(0)
    }
  
    const playNext = () => {
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setCurrentEpisodeIndex(nextRandomEpisodeIndex)
        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)
        }

    }

    const playPrevious = () => {
        if (hasPrevious) setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  
    return (
        <PlayerContext.Provider 
            value={{ 
                episodeList, 
                currentEpisodeIndex, 
                play, 
                isPlaying, 
                togglePlay, 
                setPlayingState,
                playList,
                playNext,
                playPrevious,
                hasNext,
                hasPrevious,
                toggleLoop,
                isLooping,
                isShuffling,
                toggleShuffle,
                clearPlayerState
            }}
        >
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext)
}