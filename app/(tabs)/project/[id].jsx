import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft } from 'react-native-feather';

export default function CommentSection() {
    const { id } = useLocalSearchParams();
    const [comments, setComments] = useState([
        { id: 1, user: 'User123', text: 'This is a great idea!' },
        { id: 2, user: 'JaneDoe', text: 'I totally agree with you.' },
    ]);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        if (newComment.trim()) {
            setComments([...comments, { id: Date.now(), user: 'You', text: newComment }]);
            setNewComment('');
        }
    };

    return (
        <View style={styles.container}>
            {/* Navbar */}
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => router.push('/homepage')}>
                    <ArrowLeft stroke="#ffffff" width={28} height={28} />
                </TouchableOpacity>
            </View>
            <View style={styles.navSeparator} />

            {/* Project Header */}
            <View style={styles.projectHeader}>
                <Text style={styles.projectTitle}>Project Alpha : {id?id:0}</Text>
                <Text style={styles.projectDescription}>This project is focused on building a scalable comment system like Reddit.</Text>
            </View>

            {/* Comments */}
            <ScrollView contentContainerStyle={styles.commentList}>
                {comments.map((comment) => (
                    <View key={comment.id} style={styles.commentCard}>
                        <Text style={styles.commentUser}>{comment.user}</Text>
                        <Text style={styles.commentText}>{comment.text}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* Input Box */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholder="Add a comment..."
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5FF',
        paddingTop: 40,
    },
    navbar: {
        backgroundColor: '#6C63FF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    navSeparator: {
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    projectHeader: {
        padding: 16,
        backgroundColor: '#EFEFFF',
    },
    projectTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    projectDescription: {
        fontSize: 16,
        color: '#666',
    },
    commentList: {
        padding: 16,
        paddingBottom: 80,
    },
    commentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    commentUser: {
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#6C63FF'
    },
    commentText: {
        fontSize: 16,
        color: '#333'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#DDD',
    },
    input: {
        flex: 1,
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        backgroundColor: '#FFF',
    },
    sendButton: {
        backgroundColor: '#6C63FF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    sendButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    }
});
