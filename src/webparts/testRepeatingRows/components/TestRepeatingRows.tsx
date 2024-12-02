import * as React from 'react';
import styles from './TestRepeatingRows.module.scss';
import type { ITestRepeatingRowsProps } from './ITestRepeatingRowsProps';
import { useState, useEffect } from 'react';
import { getSP } from '../pnpjsConfig';
import { TextField, DetailsList, IColumn, PrimaryButton } from "@fluentui/react";

export interface IListItem {
  listTitle: string;
  listPOR_ID: number;
}

const TestRepeatingRows: React.FC<ITestRepeatingRowsProps> = (props) => {
  const { 
    hasTeamsContext, 
  } = props;

  const sp = getSP();
  //const [listItems, setListItems] = useState<IListItem[]>([]);
  const [masterRecords, setMasterRecords] = useState<any[]>([]);
  const [selectedMaster, setSelectedMaster] = useState<any>(null);
  const [childRecords, setChildRecords] = useState<any[]>([]);
  const [newChildTitle, setNewChildTitle] = useState<string>("");

  // Fetch master records
  useEffect(() => {
    sp.web.lists
      .getByTitle("MasterRecords")
      .items()
      .then(setMasterRecords)
      .catch(console.error);
  }, []);

  // Fetch child records for the selected master
  useEffect(() => {
    if (selectedMaster) {
      sp.web.lists
        .getByTitle("ChildRecords")
        .items.filter(`MasterID eq ${selectedMaster.POR_Id}`)
        //.then(setChildRecords)
        //.catch(console.error);
    } else {
      setChildRecords([]);
    }
  }, [selectedMaster]);

  const addChild = () => {
    if (newChildTitle && selectedMaster) {
      sp.web.lists
        .getByTitle("ChildRecords")
        .items.add({ Title: newChildTitle, MasterID: selectedMaster.POR_Id })
        .then(() => {
          setNewChildTitle("");

          setChildRecords([...childRecords, { Title: newChildTitle }]);
        })
        .catch(console.error);
    }
  };

  const masterColumns: IColumn[] = [
    { key: "title", name: "Title", fieldName: "Title", minWidth: 100, maxWidth: 200, isResizable: true },
  ];

  const childColumns: IColumn[] = [
    { key: "title", name: "Title", fieldName: "Title", minWidth: 100, maxWidth: 200, isResizable: true },
  ];

  return (
    <section className={`${styles.testRepeatingRows} ${hasTeamsContext ? styles.teams : ''}`}>
    <div className={styles.testRepeatingRows}>
      <h2>Master Records</h2>
      <DetailsList
        items={masterRecords}
        columns={masterColumns}
        selectionMode={1}
        onActiveItemChanged={(item) => setSelectedMaster(item)}
      />

      {selectedMaster && (
        <>
          <h3>Child Records for: {selectedMaster.Title}</h3>
          <DetailsList items={childRecords} columns={childColumns} />

          <div>
            <TextField
              label="New Child Title"
              value={newChildTitle}
              onChange={(e, value) => setNewChildTitle(value || "")}
            />
            <PrimaryButton text="Add Child" onClick={addChild} />
          </div>
        </>
      )}
    </div>
    </section>
  );
};

export default TestRepeatingRows;