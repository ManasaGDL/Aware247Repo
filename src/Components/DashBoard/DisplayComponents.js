
import Component from "./Component";
const DisplayComponents = ({ data , bu , incidentCauseData }) => {

  return (
    <>
    { data.length === 0 && <h5>No Components</h5>}
      {data?.map((comp) => {
        return (
          <>
            {comp.has_subgroup ? (
              <div
                style={{
                  backgroundColor: `#f7f8f9`,
                  padding: `8px 16px`,
                  borderRadius: `3px`,
                  marginBottom: "8px",
                }}
              >
                <Component component={comp.component_name} status="" showLink={false} bu={bu} />
                {comp.sub_component.map((item) => {
                  return (
                    <div style={{ paddingLeft: "30px" }}>
                      <Component component={item.component_name}
                       status={item.component_status.component_status_name} isSubComponent ="true"
                       id={item.component_id} bu={bu} incidentCauseData={incidentCauseData}
                       />
                    </div>
                  );
                })}
              </div>
            ) : (
              <Component component={comp.component_name} id={comp.component_id} 
              bu={bu} status={comp.component_status.component_status_name}
              incidentCauseData={incidentCauseData}
              />
            )}
          </>
        );
      })}
    </>
  );
};
export default DisplayComponents;
