'use client'

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';
import { Pokin, Pohon } from '../type';

Font.register({ family: 'Times-Roman', src: '/font/times.ttf', fontStyle: 'normal', fontWeight: 'normal' });
Font.registerHyphenationCallback(word => [word]);

interface Modal {
    Data: Pokin[];
    tahun: number;
}

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Times-Roman",
        backgroundColor: '#ffffff',
    },
    heading: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
        marginBottom: 2,
    },
    subHeading: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 10,
    },
    // Container Utama per Item (Card)
    card: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#000',
        padding: 10,
    },
    // Baris Header OPD
    opdHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        margin: -10, // Menutup padding card
        marginBottom: 10,
        padding: 8,
        alignItems: 'center',
    },
    noBadge: {
        width: 25,
        fontSize: 10,
        fontWeight: 'bold',
    },
    namaOpd: {
        flex: 1,
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    // Row untuk Info Persentase & Tematik
    infoRow: {
        flexDirection: 'row',
        marginBottom: 5,
        paddingVertical: 3,
    },
    label: {
        width: 120,
        fontSize: 9,
        fontWeight: 'bold',
    },
    value: {
        flex: 1,
        fontSize: 9,
        textAlign: 'left',
    },
    // Khusus Persentase agar Rata Tengah di areanya
    valueCenter: {
        flex: 1,
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'center', // Sesuai permintaan Anda
        color: '#000',
    },
    tematikContainer: {
        marginTop: 5,
        paddingLeft: 10,
    },
    tematikItem: {
        fontSize: 8,
        marginBottom: 2,
        textAlign: 'left',
    },
    level1: { // Sub Tematik
        fontSize: 8,
        marginLeft: 12,
        marginTop: 2,
        color: '#333',
        textAlign: 'left',
    },
    level2: { // Sub Sub Tematik
        fontSize: 7.5,
        marginLeft: 24,
        marginTop: 1,
        color: '#555',
        fontStyle: 'italic',
        textAlign: 'left',
    },
    labelTematik: {
        fontSize: 8,
        fontWeight: 'bold',
        textAlign: 'left',
    }
});

const DocumentLeaderboardRekin: React.FC<Modal> = ({ Data, tahun }) => {
    return (
        <Document title={`Leaderboard Rekin tahun ${tahun || ""}`}>
            <Page size="A4" style={styles.page}>
                <Text style={styles.heading}>Leaderboard Rekin</Text>
                <Text style={styles.subHeading}>Tahun {tahun || ""}</Text>

                {Data.map((data, index) => (
                    <View key={index} style={styles.card} wrap={false}>
                        {/* Bagian Header Card: No & Nama OPD */}
                        <View style={styles.opdHeader}>
                            <Text style={styles.noBadge}>{index + 1}.</Text>
                            <Text style={styles.namaOpd}>{data.nama_opd || "-"}</Text>
                        </View>

                        {/* Bagian Persentase - Rata Tengah */}
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Persentase Cascading</Text>
                            <Text style={styles.value}>: </Text>
                            <Text style={styles.valueCenter}>
                                {data.persentase_cascading || "0%"}
                            </Text>
                        </View>

                        {/* Bagian Tematik - Rata Kiri */}
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Tematik</Text>
                            <Text style={styles.value}>: </Text>
                        </View>

                        <View style={styles.tematikContainer}>
                            {data.tematik && data.tematik.length > 0 ? (
                                data.tematik.map((t, t_index) => (
                                    <View key={t_index} style={{ marginBottom: 4 }}>
                                        {/* Lapis 0: Tematik Utama */}
                                        <Text style={styles.labelTematik}>
                                            {t_index + 1}. {t.nama || "-"}
                                        </Text>

                                        {/* Lapis 1: Sub Tematik */}
                                        {t.child && t.child.map((sub, s_index) => (
                                            <View key={s_index}>
                                                <Text style={styles.level1}>
                                                    {String.fromCharCode(97 + s_index)}. Sub Tematik {s_index + 1} : {sub.nama || "-"}
                                                </Text>

                                                {/* Lapis 2: Sub Sub Tematik */}
                                                {sub.child && sub.child.map((subSub, ss_index) => (
                                                    <Text key={ss_index} style={styles.level2}>
                                                        • Sub Sub Tematik {ss_index + 1} : {subSub.nama || "-"}
                                                    </Text>
                                                ))}
                                            </View>
                                        ))}
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.level1}>Tidak terlibat di tematik manapun</Text>
                            )}
                        </View>
                    </View>
                ))}
            </Page>
        </Document>
    );
}

export default DocumentLeaderboardRekin;
