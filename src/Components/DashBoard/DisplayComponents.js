import Component from "./Component";
const DisplayComponents = ({data}) =>{
    return <>
    {data.map((comp)=>{
        return <Component id={comp.component} component={comp}/>
    })}
    </>
}
export default DisplayComponents;