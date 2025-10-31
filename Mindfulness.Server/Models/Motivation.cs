﻿using System.ComponentModel.DataAnnotations;

namespace Mindfulness.Server.Models;

public class Motivation
{
    public Guid Id { get; set; }
    
    [MaxLength(300)]
    public string Message { get; set; }
}