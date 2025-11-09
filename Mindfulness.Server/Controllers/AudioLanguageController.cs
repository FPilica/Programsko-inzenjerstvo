//using AutoMapper;
//using Microsoft.AspNetCore.Mvc;
//using Mindfulness.Server.Dtos.AudioLanguage;
//using Mindfulness.Server.Models;
//
//namespace Mindfulness.Server.Controllers
//{
//    [ApiController]
//    [Route("[controller]")]
//    public class AudioLanguageController : ControllerBase
//    {
//        private readonly IMapper _mapper;
//
//        public AudioLanguageController(IMapper mapper)
//        {
//            _mapper = mapper;
//        }
//        [HttpGet("{id}")]
//        public async Task<IActionResult> GetAudioLanguage(int id)
//        {
//            return null;
//        }
//        [HttpPost]
//        public async Task<IActionResult> CreateAudioLanguage(AudioLanguageCreateDto dto)
//        {
//            return null;
//        }
//        [HttpPost]
//        public async Task<IActionResult> UpdateAudioLanguage(AudioLanguageUpdateDto dto)
//        {
//            return null;
//        }
//    }
//}
// najiskrenije ne kuzin kako funkcioniraju context i mapper, mfw automapper