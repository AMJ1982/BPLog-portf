import React from 'react'
import { Page, Document, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { getMonthName, sortByTime } from '../util/helpers'

// Creating a pdf document of the blood pressure readings of a month as a list or a line chart.
const PDFDoc = ({ contents, user, monthObjectKey, chartImg = null, lan, texts }) => {

  // Styling options for the document.
  const styles = StyleSheet.create({
    body: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35
    },
    title: {
      fontSize: 18,
      marginBottom: 20
    },
    text: {
      fontSize: 14,
      padding: 2,
      fontFamily: 'Times-Roman',    
    },
    table: {
      display: 'flex',
      flexShrink: 0,
      flexDirection: 'column',
    },
    tableRow: {
      display: 'flex',
      flexDirection: 'row',      
    },
    tableHead: {
      backgroundColor: '#EEE',
    },    
    tableCell: {
      border: '1px solid gray'
    },
    tableCellMed: {
      width: 100 / 8 + 'vw'
    },
    tableCellSmall: {
      width: 100 / 10 + 'vw'
    },
    tableCellLarge: {
      flexGrow: 1
    },
    logo: {
      position: 'absolute',
      top: -10,
      right: 0,
      width: '40px',
      height: '40px',
    }
  })
  
  // Constructing a table of received data.
  const buildTable = () => {
    const tableHeadings = texts.view.pdf.headings

    // Creating cells for the table. Call style is defined by the index created in map methods below.
    const cellStyle = (i) => {
      const style = [styles.tableCell, styles.text]
      switch (i) {
      case 0 : return [...style, styles.tableCellMed]
      case 5: return [...style, styles.tableCellLarge]
      default: return [...style, styles.tableCellSmall]
      }
    }

    return (
      <>        
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHead]}>
            {tableHeadings.map((heading, i) => 
              <Text 
                key={i}
                style={cellStyle(i)}
              >{heading}         
              </Text>)}
          </View>
          {contents.map((day) => {
            const [date] = day
            const readings = [...day[1].readings].sort(sortByTime)            
            return readings.map((entry, i) => (
              <View key={`${date}-${i}`} style={styles.tableRow}>
                <Text style={cellStyle(0)}>{i === 0 && date}</Text>
                <Text style={cellStyle(1)}>{entry.time.substring(0, 5)}</Text>
                <Text style={cellStyle(2)}>{entry.systolic}</Text>
                <Text style={cellStyle(3)}>{entry.diastolic}</Text>
                <Text style={cellStyle(4)}>{entry.pulse}</Text>
                <Text style={[cellStyle(5), { fontSize: 10 }]}>{entry.meds.join(', ')}</Text>
              </View>
            ))
          })}
        </View>
      </>
    )
  }

  
  const viewChart = () => {
    return <Image src={chartImg}></Image>
  }
  
  // If an image is received as a prop, a chart representation of readings is created.
  // Otherwise a table of the readings is created.
  return (    
    <Document>
      <Page style={styles.body}>
        <View>
          <Text style={styles.title}>{user.name}, {getMonthName(monthObjectKey, lan)}</Text>
          <Image style={styles.logo} src={require('../img/logo192.png')} /> 
        </View>        
        {!chartImg ? buildTable() : viewChart()}
      </Page>
    </Document>
  )
}

export default PDFDoc