export const getVolume  = (rawAudio:Float32Array) => {
	const total =rawAudio.reduce((acc, elem) => acc + elem*elem, 0); 
	return Math.sqrt(total/(rawAudio.length));
}

export const isClap = (rawAudio:Float32Array, sensitivty:number): boolean => {
    return rawAudio.some(
        (rawAudio: number) => {
            return Math.sqrt(rawAudio) >= 0.04 * sensitivty 
        });

}


