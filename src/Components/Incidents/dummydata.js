const componentData= [{"component_id":1,"component_name":"Adobe","businessunit_id":1,"businessunit_name":"ACS","component_status":"Operational","group_no":1,"sub_component":[]},
{"component_id":2,"component_name":"API","businessunit_id":1,"businessunit_name":"ACS","component_status":"Operational","group_no":2,"sub_component":[]},
{"component_id":5,"component_name":"Test","businessunit_id":1,"businessunit_name":"ACS","component_status":"Operational","group_no":3,
"sub_component":
[{"component_id":7,"component_name":"Test2","businessunit_id":1,
"businessunit_name":"ACS","component_status":"Degraded performance","group_no":3},
{"component_id":6,"component_name":"Test1","businessunit_id":1,"businessunit_name":"ACS","component_status":"Operational","group_no":3}]},
{"component_id":4,"component_name":"Import","businessunit_id":1,"businessunit_name":"ACS","component_status":"Operational","group_no":4,"sub_component":[]},
{"component_id":3,"component_name":"Export","businessunit_id":1,"businessunit_name":"ACS",
"component_status":"Operational","group_no":5,"sub_component":[]}]


const componentData2=[
    {
      "component_id": 1,
      "component_name": "Adobe",
      "group_no": 1,
      "has_subgroup": false,
      "businessunit_id": {
        "businessunit_id": 1,
        "businessunit_name": "ACS",
        "is_active": true,
        "createduser": null,
        "modifieduser": null
      },
      "component_status_id": {
        "component_status_id": 1,
        "component_status_name": "Degraded Performance",
        "component_status_description": "This component is fully operational and is experiencing no performance or availability issues."
      },
      "sub_component": []
    },
    {
      "component_id": 2,
      "component_name": "API",
      "group_no": 2,
      "has_subgroup": false,
      "businessunit_id": {
        "businessunit_id": 1,
        "businessunit_name": "ACS",
        "is_active": true,
        "createduser": null,
        "modifieduser": null
      },
      "component_status_id": {
        "component_status_id": 1,
        "component_status_name": "Operational",
        "component_status_description": "This component is fully operational and is experiencing no performance or availability issues."
      },
      "sub_component": []
    },
    {
      "component_id": 5,
      "component_name": "Test",
      "group_no": 3,
      "has_subgroup": true,
      "businessunit_id": {
        "businessunit_id": 1,
        "businessunit_name": "ACS",
        "is_active": true,
        "createduser": null,
        "modifieduser": null
      },
      "component_status_id": {
        "component_status_id": 1,
        "component_status_name": "Operational",
        "component_status_description": "This component is fully operational and is experiencing no performance or availability issues."
      },
      "sub_component": [
        {
          "component_id": 7,
          "component_name": "Test2",
          "group_no": 3,
          "has_subgroup": false,
          "businessunit_id": {
            "businessunit_id": 1,
            "businessunit_name": "ACS",
            "is_active": true,
            "createduser": null,
            "modifieduser": null
          },
          "component_status_id": {
            "component_status_id": 1,
            "component_status_name": "Operational",
            "component_status_description": "This component is fully operational and is experiencing no performance or availability issues."
          }
        },
        {
          "component_id": 6,
          "component_name": "Test1",
          "group_no": 3,
          "has_subgroup": false,
          "businessunit_id": {
            "businessunit_id": 1,
            "businessunit_name": "ACS",
            "is_active": true,
            "createduser": null,
            "modifieduser": null
          },
          "component_status_id": {
            "component_status_id": 1,
            "component_status_name": "Operational",
            "component_status_description": "This component is fully operational and is experiencing no performance or availability issues."
          }
        }
      ]
    },
    {
      "component_id": 4,
      "component_name": "Import",
      "group_no": 4,
      "has_subgroup": false,
      "businessunit_id": {
        "businessunit_id": 1,
        "businessunit_name": "ACS",
        "is_active": true,
        "createduser": null,
        "modifieduser": null
      },
      "component_status_id": {
        "component_status_id": 1,
        "component_status_name": "Operational",
        "component_status_description": "This component is fully operational and is experiencing no performance or availability issues."
      },
      "sub_component": []
    },
    {
      "component_id": 3,
      "component_name": "Export",
      "group_no": 5,
      "has_subgroup": false,
      "businessunit_id": {
        "businessunit_id": 1,
        "businessunit_name": "ACS",
        "is_active": true,
        "createduser": null,
        "modifieduser": null
      },
      "component_status_id": {
        "component_status_id": 1,
        "component_status_name": "Operational",
        "component_status_description": "This component is fully operational and is experiencing no performance or availability issues."
      },
      "sub_component": []
    }
  ]
export   {componentData,componentData2};