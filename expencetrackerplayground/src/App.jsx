import { Divider, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Api from './Api';
import { useState } from 'react';
import { useEffect } from 'react';
import { Card, CardHeader, CardBody, Heading, Stack, StackDivider, Box, Text } from '@chakra-ui/react'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input
} from '@chakra-ui/react'
import { Select } from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'

function App() {

    const [tracks, setTracks] = useState([]);
    const [catageories, setCatageories] = useState([]);

    const [date, setDate] = useState('');
    const [exp, setExp] = useState(0);
    const [notes, setNotes] = useState('Notes');
    const [catageory, setCatageory] = useState('');

    function loadTracks() {
        Api.GET(
            'https://expensetracker.twileloop.com/tracks',
            null,
            {
                onSuccess: (data) => {
                    setTracks(data);
                    console.log('GET request successful:', data);
                },
                onError: (error) => {
                    console.error('Error in GET request:', error);
                },
                onBadRequest: (data) => {
                    console.error('Bad request in GET:', data);
                },
                onUnauthorized: (data) => {
                    console.error('Unauthorized in GET:', data);
                },
                onForbid: (data) => {
                    console.error('Forbidden in GET:', data);
                }
            }, null
        );
    }

    function loadCatageories() {
        Api.GET(
            'https://expensetracker.twileloop.com/categories',
            null,
            {
                onSuccess: (data) => {
                    setCatageories(data);
                    console.log('GET request successful:', data);
                },
                onError: (error) => {
                    console.error('Error in GET request:', error);
                },
                onBadRequest: (data) => {
                    console.error('Bad request in GET:', data);
                },
                onUnauthorized: (data) => {
                    console.error('Unauthorized in GET:', data);
                },
                onForbid: (data) => {
                    console.error('Forbidden in GET:', data);
                }
            }, null
        );
    }

    function addTrack() {
        const postData = {
            date: date,
            exp: exp,
            inc: 0,
            notes: notes,
            category: catageory
        };
        Api.POST(
            'https://expensetracker.twileloop.com/tracks',
            postData,
            {
                onSuccess: (data) => {
                    console.log('POST request successful:', data);
                    loadTracks();
                    loadCatageories();
                },
                onError: (error) => {
                    console.error('Error in POST request:', error);
                },
                onBadRequest: (data) => {
                    console.error('Bad request in POST:', data);
                },
                onUnauthorized: (data) => {
                    console.error('Unauthorized in POST:', data);
                },
                onForbid: (data) => {
                    console.error('Forbidden in POST:', data);
                }
            },
            null
        );
    }

    function formatDateToISO() {
        const date = new Date();

        const pad = (number, length = 2) => {
            return number.toString().padStart(length, '0');
        };

        const year = date.getUTCFullYear();
        const month = pad(date.getUTCMonth() + 1); // Months are zero-based
        const day = pad(date.getUTCDate());
        const hours = pad(date.getUTCHours());
        const minutes = pad(date.getUTCMinutes());
        const seconds = pad(date.getUTCSeconds());
        const milliseconds = pad(date.getUTCMilliseconds(), 3); // Pad to 3 digits

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    }

    console.log(formatDateToISO());



    useEffect(x => {
        loadCatageories();
        loadTracks();
        setDate(formatDateToISO());
    }, []);

    return (
        <>
            <Tabs variant='soft-rounded' colorScheme='green'>
                <TabList>
                    <Tab onClick={() => loadCatageories() }>Catageories</Tab>
                    <Tab>Traces</Tab>
                    <Tab>Report</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>

                        <Card>
                            <CardHeader>
                                <Heading size='md'>All Catageories</Heading>
                            </CardHeader>

                            <CardBody>
                                <Stack divider={<StackDivider />} spacing='4'>
                                    {catageories.map(x => {
                                        return (
                                            <>
                                                <Heading size='xs' textTransform='uppercase'>
                                                    {x.title}
                                                </Heading>
                                                <Text pt='2' fontSize='sm'>
                                                    {x.text}
                                                </Text>
                                            </>
                                        );
                                    })}
                                    <Box>

                                    </Box>
                                </Stack>
                            </CardBody>
                        </Card>


                    </TabPanel>
                    <TabPanel>
                        <FormControl>
                            <FormLabel>Date</FormLabel>
                            <Input type='text' value={date} />

                            <FormLabel>Expence</FormLabel>
                            <Input type='number' value={exp} onChange={(e) => setExp(e.target.value)} />

                            <FormLabel>Notes</FormLabel>
                            <Input type='text' value={notes} onChange={(e) => setNotes(e.target.value)} />

                            <FormLabel>Catageory</FormLabel>
                            <Select onChange={(e) => setCatageory(e.target.value)} >
                                {catageories.map(x => {
                                    return <option key={x.id} value={x.id} >{x.title}</option>;
                                })}
                            </Select>

                        </FormControl>

                        <Button colorScheme='blue' onClick={() => addTrack()}>Add Track</Button>



                        <Card>
                            <CardHeader>
                                <Heading size='md'>All Tracks</Heading>
                            </CardHeader>

                            <CardBody>
                                <Stack divider={<StackDivider />} spacing='4'>
                                    {tracks.map(x => {
                                        return (
                                            <>
                                                <Heading size='xs' textTransform='uppercase'>
                                                    {x.notes}
                                                </Heading>
                                                <Text pt='2' fontSize='sm'>
                                                    INR {x.exp} /-
                                                </Text>
                                                <Text pt='2' fontSize='md'>
                                                    {catageories.find(y => y.id == x.category)?.title}
                                                </Text>
                                            </>
                                        );
                                    })}
                                    <Box>

                                    </Box>
                                </Stack>
                            </CardBody>
                        </Card>

                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    )
}

export default App
