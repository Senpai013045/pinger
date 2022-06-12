//@ts-check
/**
 * 
 * @param {string} ip 
 * @param {(state:"responded"|"timeout",startTime:number)=>void} callback 
 */
export const Pinger = (ip,callback)=>{
    const state = {
        status: "unchecked",
        inUse:true,
        callback,
        ip,
        img: new Image(),
        start:new Date().getTime()
    }
    state.img.onload = ()=>{
        state.inUse = false;
        state.callback("responded",state.start);
    }
    state.img.onerror = ()=>{
        if(state.inUse){
            state.inUse = false;
            state.callback("responded",state.start);
        }
    }
    state.img.crossOrigin = "anonymous";
    state.img.src = `http://${ip}`;
    const timer = setTimeout(()=>{
        if(state.inUse){
            state.inUse = false;
            state.callback("timeout",state.start);
        }
    },2000)
    state.timer = timer;
    return state;
}