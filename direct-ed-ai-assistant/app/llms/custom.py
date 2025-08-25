import requests
import json
from typing import Any, List, Optional
from langchain_core.callbacks.manager import CallbackManagerForLLMRun
from langchain_core.language_models.chat_models import SimpleChatModel
from langchain_core.messages import BaseMessage

class CustomChatModel(SimpleChatModel):
    """A custom chat model that calls a remote FastAPI endpoint."""
    api_url: str

    def _parse_response(self, full_text: str) -> str:
        """
        Parses the full model output to extract only the final generated answer,
        removing any "instruction echoing" from the prompt.
        """
        # Define the keywords that signal the start of the actual answer.
        # The order matters; it will check for "Helpful Answer:" first.
        split_markers = [
            "Helpful Answer:",
            "Quiz Questions:",
            "Flashcards:",
        ]
        
        for marker in split_markers:
            if marker in full_text:
                # Split the text by the marker and take the second part
                return full_text.split(marker, 1)[1].strip()
        
        # If no marker is found, it's likely the old model format, so return the original text.
        return full_text.strip()

    @property
    def _llm_type(self) -> str:
        return "custom_chat_model"

    def _call(
        self,
        messages: List[BaseMessage],
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> str:
        raw_prompt = messages[-1].content
        data = {"prompt": raw_prompt, **kwargs}
        headers = {"Content-Type": "application/json"}

        try:
            response = requests.post(self.api_url, headers=headers, data=json.dumps(data))
            response.raise_for_status()
            
            result = response.json()
            full_text = result.get("response", "")

            assistant_response = self._parse_response(full_text)
            
            if not assistant_response:
                raise ValueError("Model returned an empty response after parsing.")
            
            return assistant_response

        except (requests.exceptions.RequestException, ValueError) as e:
            print(f"Custom model failed: {e}. Attempting fallback.")
            raise