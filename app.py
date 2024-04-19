from flask import Flask, jsonify, request
from flask_cors import CORS
from transformers import pipeline
import json
import logging

app = Flask(__name__)
CORS(app)

logging.getLogger('flask_cors').level = logging.DEBUG

DATA_FILE = 'conversations.json'

# Load the summarization pipeline
summarizer = pipeline("summarization", model="philschmid/bart-large-cnn-samsum")


# Endpoint to load all conversations
@app.route('/load_conversations', methods=['GET'])
def load_conversations():
    try:
        with open(DATA_FILE, 'r') as f:
            conversations = json.load(f)
            return jsonify(conversations), 200
    except FileNotFoundError:
        # If the file doesn't exist, return an empty list
        return jsonify([]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Endpoint to save a new conversation
@app.route('/save_conversation', methods=['POST'])
def save_conversation():
    try:
        new_conversation = request.json
        # Read existing conversations
        try:
            with open(DATA_FILE, 'r') as f:
                conversations = json.load(f)
        except FileNotFoundError:
            conversations = []

        # Add the new conversation
        conversations.append(new_conversation)

        # Write back to the file
        with open(DATA_FILE, 'w') as f:
            json.dump(conversations, f, indent=2)

        return jsonify({'message': 'Conversation saved successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Endpoint to summarize a conversation
@app.route('/summarize', methods=['POST'])
def summarize_conversation():
    try:
        # Ensure the request contains JSON data
        data = request.get_json()
        if not data or 'messages' not in data:
            return jsonify({'error': 'Invalid request. Please provide conversation messages.'}), 400

        messages = data['messages']
        conversation_text = "\n".join(f"{msg['sender']}:{msg['text']}" for msg in messages)

        # Attempt to generate a short summary (these settings are a starting point, and might need adjustment)
        summaries = summarizer(conversation_text, max_length=10, min_length=2, do_sample=False)

        # Further process the first summary to trim it to 2-5 words
        summary_text = summaries[0]['summary_text']
        summary_words = summary_text.split()
        print(f"summary: {summary_text}")

        # Trim the summary to the desired word count
        trimmed_summary = ' '.join(summary_words[:5])

        return jsonify({'summary': trimmed_summary}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# # Endpoint to answer a user question
# @app.route('/question', methods=['POST'])
# def answer_user_question():
#     try:
#         # Ensure the request contains JSON data
#         data = request.get_json()
#         if not data or 'messages' not in data:
#             return jsonify({'error': 'Invalid request. Please provide conversation messages.'}), 400

#         question = data['question']

#         return jsonify({'summary': trimmed_summary}), 200

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)
