// alle audios met eigenschappen in een variabel
const audio = {
    map: new Howl({
        src: 'audio/Mandala Dreams - Paths of a Samurai - trimmed.mp3',
        volume: 0.04,
        loop: true
    }),
    mapAmbience: new Howl({
        src: 'audio/forest-birds.wav',
        volume: 0.2,
        loop: true
    }),
    playerWhoosh: new Howl({
        src: 'audio/metal-whoosh.wav',
        volume: 0.1
    }),
    kenjiWhoosh: new Howl({
        src: 'audio/fast-sword-whoosh.wav',
        volume: 0.1
    })
}