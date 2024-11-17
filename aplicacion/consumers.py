from channels.generic.websocket import AsyncWebsocketConsumer
import json

class ChatConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_code']
        self.room_group_name = f'chat_group_{self.room_name}'
        self.user = self.scope['user']
        
        if self.user.is_authenticated:
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            
            await self.accept()
            
        else:
            await self.close()
    
    async def disconnect(self, close_code):
        
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
        await self.close()
    
    async def receive(self, text_data):
        data = json.loads(text_data) # Equivalente a JSON.parse()
        
        if data['type'] == 'mensaje':
            
            await self.channel_layer.group_send(
                self.room_group_name,
                { # Este diccionario es el mensaje que se envía a todos los consumidores (Se identifica con event)
                    'type': 'mensaje', # Este type representa a una función
                    'mensaje': data['mensaje'],
                    'username': self.user.username
                }
            )
            
        elif data['type'] == 'escribiendo':
            
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'escribiendo'
                }
            )
            
    async def escribiendo(self, event):
        
        await self.send(text_data=json.dumps({
            'type': 'escribiendo'
        }))
            
    async def mensaje(self, event):
        
        await self.send(text_data=json.dumps({
            'type': 'mensaje',
            'mensaje': event['mensaje'],
            'username': event['username'],
            'sender': self.user.username == event['username']
        }))