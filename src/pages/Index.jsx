import React, { useState } from "react";
import { Container, VStack, Text, Button, Input, Table, Thead, Tbody, Tr, Th, Td, IconButton } from "@chakra-ui/react";
import { FaPlus, FaTrash, FaDownload } from "react-icons/fa";
import Papa from "papaparse";
import { CSVLink } from "react-csv";

const Index = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState("edited_data.csv");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setHeaders(Object.keys(result.data[0]));
          setData(result.data);
        },
      });
    }
  };

  const handleAddRow = () => {
    const newRow = headers.reduce((acc, header) => ({ ...acc, [header]: "" }), {});
    setData([...data, newRow]);
  };

  const handleRemoveRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleInputChange = (index, header, value) => {
    const newData = [...data];
    newData[index][header] = value;
    setData(newData);
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">CSV Upload, Edit, and Download Tool</Text>
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
        {data.length > 0 && (
          <>
            <Table variant="simple">
              <Thead>
                <Tr>
                  {headers.map((header) => (
                    <Th key={header}>{header}</Th>
                  ))}
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((row, rowIndex) => (
                  <Tr key={rowIndex}>
                    {headers.map((header) => (
                      <Td key={header}>
                        <Input
                          value={row[header]}
                          onChange={(e) => handleInputChange(rowIndex, header, e.target.value)}
                        />
                      </Td>
                    ))}
                    <Td>
                      <IconButton
                        aria-label="Remove row"
                        icon={<FaTrash />}
                        onClick={() => handleRemoveRow(rowIndex)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Button leftIcon={<FaPlus />} onClick={handleAddRow}>
              Add Row
            </Button>
            <Button leftIcon={<FaDownload />} colorScheme="teal">
              <CSVLink data={data} headers={headers} filename={fileName} style={{ color: "white", textDecoration: "none" }}>
                Download CSV
              </CSVLink>
            </Button>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default Index;